// // Infer T dynamic type from value in constructor

type SignalSubscriber<T> = (value: T) => void;

// export function signal<T>(intialValue: T) {
//   let value: T = intialValue;
//   const subscribers = new Set<Subscriber>();

//   const notify = () => subscribers.forEach((sub) => sub());

//   const signal = new Proxy(() => value, {
//     apply(_, _this, args: T[] | undefined) {
//       if (args && args.length > 0) {
//         const newValue = args[0];
//         if (value !== newValue) {
//           value = newValue;
//           notify();
//         }
//         return undefined;
//       }
//       return value;
//     },
//   }) as any;

//   signal.set = (newValue: T) => {
//     if (newValue !== value) {
//       value = newValue;
//       notify();
//     }
//   };

//   signal.subscribe = (cb: Subscriber) => {
//     subscribers.add(cb);
//     return () => subscribers.delete(cb);
//   };

//   return signal;
// }

export function signal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<SignalSubscriber<T>>();

  const notify = () => {
    subscribers.forEach((sub) => sub(value));
  };

  const signal = {
    get value() {
      return value;
    },
    set value(newValue: T) {
      if (newValue !== value) {
        value = newValue;
        notify();
      }
    },
    subscribe(cb: SignalSubscriber<T>) {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
  };

  return signal;
}
