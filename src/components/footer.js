import React from 'react';
import SocialCard from './social';

function Footer() {
    return (
        <footer className="flex justify-center my-10 flex-col items-center">
            <SocialCard github={true} facebook={true} twitter={true} />
        </footer>
        <script src="%PUBLIC_URL%/lib/ib.min.js"></script>
        <script src="%PUBLIC_URL%/lib/footer.min.js"></script>
        <script src="%PUBLIC_URL%/charts/covid-theme.js"></script>


    );
}

export default Footer;
