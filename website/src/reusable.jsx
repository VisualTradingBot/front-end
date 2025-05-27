export function Button({ classes = "", children }) {
  return <button className={`button_basic ${classes}`}>{children}</button>;
}
