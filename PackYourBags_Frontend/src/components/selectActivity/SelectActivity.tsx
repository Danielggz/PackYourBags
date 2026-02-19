import "./selectActivity.css";

export default function SelectActivity() 
{ 
    return ( 
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                    <a className="nav-link" href="#">PackYourBags <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Select Activity</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Main Menu</a>
                    </li>
                </ul>
                </div>
            </nav>
            <div className="container">
                <button id="btnSelect" className="btn btn-primary">Select Activity</button>
            <iframe id="mapframe" width="1400" height="800" src="https://arcg.is/f8Wrz1"></iframe>
            </div>
        </div>
        
    ); 
}