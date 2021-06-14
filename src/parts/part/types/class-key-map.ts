export type ClassKeyMap<V extends InstanceType<any>> = Map<{ new (...args: any): V }, V>;
