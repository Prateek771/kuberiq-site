type ScrollFrame = (position: number, time: number) => void;
const subscribers = new Set<ScrollFrame>();
export function subscribeScrollFrame(callback: ScrollFrame) {
  subscribers.add(callback);
  return () => { subscribers.delete(callback); };
}
export function renderScrollFrame(position: number, time: number) {
  subscribers.forEach(callback => callback(position, time));
}
