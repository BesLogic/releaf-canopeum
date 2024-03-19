import canopeum_logo from '@assets/images/Canopeum_Logo.jpg';

export default function Utilities() {
    return (
        <div>
            <div className="container d-flex flex-column gap-2">    
                <h1>Utilities</h1>
                <h2>Bootstrap Button Showcase</h2>
                <div className="d-flex gap-1">
                    <button type="button" className="btn btn-primary">Primary</button>
                    <button type="button" className="btn btn-secondary">Secondary</button>
                    <button type="button" className="btn btn-success">Success</button>
                    <button type="button" className="btn btn-danger">Danger</button>
                    <button type="button" className="btn btn-warning">Warning</button>
                    <button type="button" className="btn btn-info">Info</button>
                    <button type="button" className="btn btn-light">Light</button>
                    <button type="button" className="btn btn-dark">Dark</button>
                    <button type="button" className="btn btn-link">Link</button>
                </div>
                <div className="d-flex gap-1">
                    <button type="button" className="btn btn-outline-primary">Primary</button>
                    <button type="button" className="btn btn-outline-secondary">Secondary</button>
                    <button type="button" className="btn btn-outline-success">Success</button>
                    <button type="button" className="btn btn-outline-danger">Danger</button>
                    <button type="button" className="btn btn-outline-warning">Warning</button>
                    <button type="button" className="btn btn-outline-info">Info</button>
                    <button type="button" className="btn btn-outline-light">Light</button>
                    <button type="button" className="btn btn-outline-dark">Dark</button>
                </div>

                <div className="alert alert-primary" role="alert">
                    A simple primary alert—check it out!
                </div>
                <div className="alert alert-secondary" role="alert">
                    A simple secondary alert—check it out!
                </div>
                
                <span className="badge badge-primary">Primary Badge</span>
                <span className="badge badge-secondary">Secondary Badge</span>
                
                <div className="card d-flex flex-row w-5">
                    <img src={canopeum_logo} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
                
                <form>
                    <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                    <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}