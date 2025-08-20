import "./homepage.scss";
import {
  Header,
  Boxes,
  Motive,
  DropDownTile,
  Sponsors,
} from "../../components/HomePage/components_homepage.jsx";

export default function HomePage() {
  return (
    <>
      <Header />
      <Sponsors />
      <Boxes />
      <Motive />
      <DropDownTile title="01">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut
        neque vel eros lobortis scelerisque eget ut ipsum. Cras scelerisque
        massa at mi egestas, in ullamcorper odio tincidunt. Nam vitae lobortis
        purus.
      </DropDownTile>
      <DropDownTile title="02">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut
        neque vel eros lobortis scelerisque eget ut ipsum. Cras scelerisque
        massa at mi egestas, in ullamcorper odio tincidunt. Nam vitae lobortis
        purus.
      </DropDownTile>
      <DropDownTile title="03">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut
        neque vel eros lobortis scelerisque eget ut ipsum. Cras scelerisque
        massa at mi egestas, in ullamcorper odio tincidunt. Nam vitae lobortis
        purus.
      </DropDownTile>
      <DropDownTile title="04">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut
        neque vel eros lobortis scelerisque eget ut ipsum. Cras scelerisque
        massa at mi egestas, in ullamcorper odio tincidunt. Nam vitae lobortis
        purus.
      </DropDownTile>
    </>
  );
}

function Showcase() {
  return (
    <Spline scene="https://prod.spline.design/xZ8Zc1uatcCkfg03/scene.splinecode" />
  );
}
