import { Link } from "react-router";


export const MenuCard = ({ name, link }) => {
  return (
    <div>
      <div className="card" style={{ width: "18rem" }}>
      {/*   <img
          src="../img/seg_vehiculo_red.png"
          className="card-img-top "
          alt="..."
        /> */}
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          {/*  <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the cards content.
          </p> */}
          <Link to={link} className="btn btn-primary">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};
