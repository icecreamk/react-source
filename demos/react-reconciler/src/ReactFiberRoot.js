/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactFiber';
import type {ExpirationTime} from './ReactFiberExpirationTime';
import type {TimeoutHandle, NoTimeout} from './ReactFiberHostConfig';
import type {Interaction} from 'scheduler/src/Tracing';

import {noTimeout} from './ReactFiberHostConfig';
import {createHostRootFiber} from './ReactFiber';
import {NoWork} from './ReactFiberExpirationTime';
import {enableSchedulerTracing} from 'shared/ReactFeatureFlags';
import {unstable_getThreadID} from 'scheduler/tracing';

// TODO: This should be lifted into the renderer.
export type Batch = {
  _defer: boolean,
  _expirationTime: ExpirationTime,
  _onComplete: () => mixed,
  _next: Batch | null,
};

export type PendingInteractionMap = Map<ExpirationTime, Set<Interaction>>;

type BaseFiberRootProperties = {|
  // Any additional information from the host associated with this root.
  // root节点，render方法接收的第二个参数
  containerInfo: any,
  // Used only by persistent updates.
  // 在持久更新中用到（server render），react-dom中不会用到
  pendingChildren: any,
  // The currently active root fiber. This is the mutable root of the tree.
  // Fiber对象，每一个react element都会对于一个fiber，是一个树结构，Root Fiber是整个树的顶点
  current: Fiber,

  // The following priority levels are used to distinguish between 1)
  // uncommitted work, 2) uncommitted work that is suspended, and 3) uncommitted
  // work that may be unsuspended. We choose not to track each individual
  // pending level, trading granularity for performance.
  //
  // The earliest and latest priority levels that are suspended from committing.
  // 以下的优先级是用来区分
  // 1.没有提交（committed）的任务
  // 2.没有提交的挂起任务
  // 3.没有提交的可能被挂起的任务
  // 为了兼容性能，选择不追踪每个单独的阻塞登记
  // 最老和新的在提交的时候被挂起的任务
  earliestSuspendedTime: ExpirationTime,
  latestSuspendedTime: ExpirationTime,
  // The earliest and latest priority levels that are not known to be suspended.
  // 最老和最新的不确定是否会挂起的优先级（所有任务进来一开始是这个状态）
  earliestPendingTime: ExpirationTime,
  latestPendingTime: ExpirationTime,
  // The latest priority level that was pinged by a resolved promise and can
  // be retried.
  // 最新的通过以promise被resolve并且可以重新尝试的优先级
  latestPingedTime: ExpirationTime,

  // If an error is thrown, and there are no more updates in the queue, we try
  // rendering from the root one more time, synchronously, before handling
  // the error.
  // 如果有错误被抛出并没有更多的更新存在，尝试在处理错误前同步重新从头渲染
  // 在renderRoot出现无法处理的错误时会被设置为true
  didError: boolean,

  // 正在等待提交的任务 expirationTime
  pendingCommitExpirationTime: ExpirationTime,
  // A finished work-in-progress HostRoot that's ready to be committed.
  // 已完成的任务的FiberRoot对象，如果你只有一个Root，那他永远只可能是这个root对于的fiber,或者是null
  // 在commit阶段只会处理这个值对应的任务
  finishedWork: Fiber | null,
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if
  // it's superseded by a new one.
  // 在任务被挂起的时候通过setTimeout设置返回的内容，用来下一次如果有新的任务挂起时清理还没触发的timeout
  timeoutHandle: TimeoutHandle | NoTimeout,
  // Top context object, used by renderSubtreeIntoContainer
  // 顶层context对象，只有主动调用renderSubtreeIntoContainer是才会有用
  context: Object | null,
  pendingContext: Object | null,
  // Determines if we should attempt to hydrate on the initial mount
  // 用来确定第一次渲染的时候是否需要融合
  +hydrate: boolean,
  // Remaining expiration time on this root.
  // 当天root上剩余的过期时间
  // TODO: Lift this into the renderer
  nextExpirationTimeToWorkOn: ExpirationTime,
  // 当前更新对应的过期时间
  expirationTime: ExpirationTime,
  // List of top-level batches. This list indicates whether a commit should be
  // deferred. Also contains completion callbacks.
  // TODO: Lift this into the renderer
  // 顶层批次（批处理任务？）指名一个commit是否应该推迟
  // 同时包括完成之后的回调
  // 用在测试？
  firstBatch: Batch | null,
  // Linked-list of roots
  // root之间管理的链表结构
  nextScheduledRoot: FiberRoot | null,
|};

// The following attributes are only used by interaction tracing builds.
// They enable interactions to be associated with their async work,
// And expose interaction metadata to the React DevTools Profiler plugin.
// Note that these attributes are only defined when the enableSchedulerTracing flag is enabled.
type ProfilingOnlyFiberRootProperties = {|
  interactionThreadID: number,
  memoizedInteractions: Set<Interaction>,
  pendingInteractionMap: PendingInteractionMap,
|};

// Exported FiberRoot type includes all properties,
// To avoid requiring potentially error-prone :any casts throughout the project.
// Profiling properties are only safe to access in profiling builds (when enableSchedulerTracing is true).
// The types are defined separately within this file to ensure they stay in sync.
// (We don't have to use an inline :any cast when enableSchedulerTracing is disabled.)
export type FiberRoot = {
  ...BaseFiberRootProperties,
  ...ProfilingOnlyFiberRootProperties,
};

// 返回一个对象
export function createFiberRoot(
  containerInfo: any,
  isConcurrent: boolean,
  hydrate: boolean,
): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(isConcurrent);

  let root;
  if (enableSchedulerTracing) {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,

      interactionThreadID: unstable_getThreadID(),
      memoizedInteractions: new Set(),
      pendingInteractionMap: new Map(),
    }: FiberRoot);
  } else {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,
    }: BaseFiberRootProperties);
  }

  uninitializedFiber.stateNode = root;

  // The reason for the way the Flow types are structured in this file,
  // Is to avoid needing :any casts everywhere interaction tracing fields are used.
  // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
  // $FlowFixMe Remove this :any cast and replace it with something better.
  return ((root: any): FiberRoot);
}
