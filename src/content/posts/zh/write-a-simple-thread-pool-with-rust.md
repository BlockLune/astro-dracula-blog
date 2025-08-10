---
abbrlink: 118aec2d
categories:
  - CS
  - Languages
  - Rust
date: 2024-10-17 13:03:29
tags:
  - rust
  - concurrency
  - thread-pool
  - web-server
  - software-engineering
  - programming-language
title: 使用 Rust 写一个简单的线程池
---

线程池是一种多线程处理形式，它通过将任务分配给事先创建好的线程以进行重用，提高了并发性能。本文是一篇阅读笔记，原材料为 [Rust 语言圣经 - 进阶实战 1 实现一个 Web 服务器](https://course.rs/advance-practice1/intro.html)。

<!--more-->

在实现线程池之前，先来看看我们希望怎么用它：

```rust
fn main() {
 let pool = ThreadPool::new(4); // 创建一个包含 4 个线程的线程池

 // 对于前来的每个任务，将其放到池子中执行
 for task in tasks {
  pool.execute(|| {
   handle_task(task);
  });
 }
}
```

因此，我们的线程池的骨架可能是这样的：

```rust
pub struct ThreadPool;

impl ThreadPool {
 pub fn new(size: usize) -> Self {
  // ...
 }

 pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
  // ...
    }
}
```

这里的 `FnOnce` 表示我们希望这个闭包只需要被执行一次，紧跟着的 `()` 表示该闭包没有参数，后面没有跟 `->` 所以这个闭包也没有返回值。

我们的 `new` 函数要干的第一件事情是，创建一些线程并存起来：

```rust
use std::thread;

pub struct ThreadPool {
 threads: Vec<thread::JoinHandle<()>>,
}

impl ThreadPool {
 pub fn new(size: usize) -> Self {
  let mut threads = Vec::with_capactiy(size);
  for _ in 0..size {
   // 创建线程并存储
  }
  Self { threads }
 }

 // ...
}
```

创建线程的方式是使用 `thread::spawn`，但是它会立刻开始执行传入的任务。但是在这里，我们希望的应该是 “创建线程但暂时不执行”。为此，我们可以创建一个中介性质的对象 `Worker`：

```rust
struct Worker {
 id: usize,
 thread: thread::JoinHandle<()>,
}

impl Worker {
 fn new(id: usize) -> Self {
  // 从任务列表中取出一个任务
  // ...

  // 创建一个线程，以执行这个任务
  let thread = thread::spawn(|| {
   // ...
  });

  Self { id, thread }
 }
}
```

然后，就可以改一下上面线程池的声明：

```rust
pub struct ThreadPool {
 workers: Vec<Worker>,
}

impl ThreadPool {
 pub fn new(size: usize) -> Self {
  let mut workers = Vec::with_capactiy(size);
  for id in 0..size {
   workers.push(Worker::new(id));
  }
  Self { workers }
 }

 // ...
}
```

`ThreadPool::new` 的下一步任务是将传递来的任务分配给刚刚创建好的线程执行。如何实现呢？可以使用 Channel。可以让 `ThreadPool` 持有发送端，由它负责将任务发出去；而让 `Worker` 持有接收端，它接收发来的任务并将它们分配到具体的线程中执行。

但是，现在存在一个问题，`mpsc` 是 Multiple Producers Single Consumer，但是这里的情况是很多 `Worker` 希望从发送端接受消息，是 Multiple Consumers。怎么办呢？答案是使用 `Arc<Mutex<_>>` 。这样，多个 `Worker`s 都可以持有 `receiver`（通过 `Arc`），但最后一次只有一个 `Worker` 能实际从这个 `receiver` 中拿到消息 / 拿到需要执行的任务（通过 `Mutex`）：

```rust
use std::{
 sync::{mpsc, Arc, Mutex},
 thread,
};

impl ThreadPool {
 pub fn new(size: usize) -> Self {
  let (sender, receiver) = mpsc::channel();
  let receiver = Arc::new(Mutex::new(receiver));
  let mut workers = Vec::with_capacity(size);

  for id in 0..size {
   workers.push(Worker::new(id, Arc::clone(&receiver)));
  }
  Self { workers, sender }
 }

 // ...
}

impl Worker {
 fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Self {
  // 从任务列表中取出一个任务（使用 `receiver`）
  // ...

  // 创建一个线程，以执行这个任务
  let thread = thread::spawn(|| {
   // ...
  });

  Self { id, thread }
 }
}
```

接下来就是具体的发送任务和接受任务并执行了。首先需要确定的是，用什么类型来表示上面的 任务 `Job` 呢？答案是：

```rust
type Job = Box<dyn FnOnce() + Send + 'static>;
```

然后就可以发送和接收任务了。注意 `recv` 的调用是阻塞的：

```rust
impl ThreadPool {
 // ...
 pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
  let job = Box::new(f);
  self.sender.send(job).unwrap();
    }
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Self {
        let thread = thread::spawn(move || loop {
            let job = receiver.lock().unwrap().recv().unwrap();
            println!("Worker {id} got a job; executing.");
            job();
        });

        Self { id, thread }
    }
}
```

注意这里**不能用 `while let`**。主要原因是 `Mutex` 没有显式的 "unlock"，如果使用 `while let`，那么必须等到整个循环结束锁才会被释放。而像这里的使用 `let job = ...;`，中间的临时变量会在 `let` 结束时就被 `drop`，锁可以立刻被释放。

最后一步是为我们实现的这个简单的线程池实现 `Drop`，主要是等待任务结束并回收资源。但这样是不行的：

```rust
// error
impl Drop for ThreadPool {
    fn drop(&mut self) {
        for worker in &mut self.workers {
            println!("Shutting down worker {}", worker.id);
            worker.thread.join().unwrap();
        }
    }
}
```

报错原因是所有权。

可行的解决方案是使用 `Option` 类型，并使用 `take` 方法拿走内部值的所有权。类似地，对 `sender` 也需要做这样的处理。最后，当 `sender` 被关闭，对应的 `receiver` 会收到一个错误，可以根据是否接收到错误，来判断 Channel 是否需要被关闭，进而判断线程是否需要结束了：

```rust
use std::{
    sync::{mpsc, Arc, Mutex},
    thread,
};

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;

impl ThreadPool {
    pub fn new(size: usize) -> ThreadPool {
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }

        ThreadPool {
            workers,
            sender: Some(sender),
        }
    }

    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.as_ref().unwrap().send(job).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take());

        for worker in &mut self.workers {
            println!("Shutting down worker {}", worker.id);
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();

            match message {
                Ok(job) => {
                    println!("Worker {id} got a job; executing.");

                    job();
                }
                Err(_) => {
                    println!("Worker {id} disconnected; shutting down.");
                    break;
                }
            }
        });

        Worker {
            id,
            thread: Some(thread),
        }
    }
}
```
