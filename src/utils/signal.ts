type SignalSubscriber<T> = (value: T) => void;

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
