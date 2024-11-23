import "../CSS/Help.css";
import helpIcon from "../Images/help.png";

const Help = () => {
  return (
    <>
      <div className="help">
        <img src={helpIcon} alt="Help Icon" className="helpImage" />
        <h6>Get Help</h6>
        <br />
      </div>
    </>
  );
};

export default Help;
