import iconDiploma from "@assets/icons/diploma-regular.svg";
import iconPinMap from "@assets/icons/pin-map-solid.svg";

export default function Analytics() {
    return (
        <div>
            <h1>Analytics</h1>
            <button type="button" className="btn btn-primary btn-sm">Primary sm</button>
            <button type="button" className="btn btn-primary">Primary md</button>
            <button type="button" className="btn btn-primary btn-lg">Primary lg</button>

            <button type="button" className="btn btn-secondary btn-sm">Secondary sm</button>
            <button type="button" className="btn btn-secondary">Secondary md</button>
            <button type="button" className="btn btn-secondary btn-lg">Secondary lg</button>

            <button type="button" className="btn btn-outline-primary btn-sm">Primary Outline sm</button>
            <button type="button" className="btn btn-outline-primary">Primary Outline md</button>
            <button type="button" className="btn btn-outline-primary btn-lg">Primary Outline lg</button>

            <button type="button" className="btn btn-outline-secondary btn-sm">Secondary Outline sm</button>
            <button type="button" className="btn btn-outline-secondary">Secondary Outline md</button>
            <button type="button" className="btn btn-outline-secondary btn-lg">Secondary Outline lg</button>

            <div className="card d-flex flex-row" style={{ width: '30rem'}}>
                <img src="/Canopeum_Logo.jpg" className="w-25 img-fluid" alt="..."/>
                <div className="card-body w-75">
                    <h5 className="card-title">Canopeum Site A</h5>
                    <p className="card-text">
                        <img src={iconDiploma} alt="iconDiploma"></img>
                        Site type X
                     </p>
                    <p className="card-text">
                        <img src={iconPinMap} alt="iconPinMap"></img>
                        Saint-Denis-sur-Richelieu
                    </p>
                </div>
            </div>
        </div>
    );
}