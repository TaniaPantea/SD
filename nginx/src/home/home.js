import React from 'react';
import { Button, Container } from 'reactstrap';

import BackgroundImg from '../commons/images/blue.png';

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
};
const textStyle = { color: 'white', };

function Home() {
    return (
        <div className="p-5 mb-4 bg-light rounded-3">
            <Container fluid className="py-5">
                <h1 className="display-5 fw-bold">Energy Management System</h1>
                <p className="col-md-8 fs-4">
                    Monitorizează consumul în timp real și interacționează cu asistentul nostru AI.
                </p>
                <Button color="primary" size="lg">Află mai multe</Button>
            </Container>
        </div>
    );
}


export default Home;