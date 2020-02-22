### expirationTime
- Sync模式
 + 优先级最高，该任务更新之后，立马执行
- 异步模式
 + 异步任务的优先级较低，有可能被其他任务占用而延后执行，为了保证异步任务一直被延后而无法执行，设立expirationTime，保证异步任务在expirationTime的时候强制执行
- 指定context