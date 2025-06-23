import Bheemesh from "./Bheemesh";
import Jaga from "./Jaga";

function Murali({ message, employee }) {
  return (
    <div>
      {/* <h2>hello From Murali Component !!!</h2> */}
      {/* <Jaga />
      <Bheemesh/> */}
      <h1>{message}</h1>
      <h1>{employee}</h1>
    </div>
  );
}

export default Murali;
