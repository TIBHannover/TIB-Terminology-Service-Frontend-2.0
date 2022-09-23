import headerImg from '../../assets/img/background.png';

export const HeaderImg = () => {
    return (
        <section>
            <div style={{ backgroundImage: `url(${headerImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'}}>

                <div className="container" style={{minHeight: '550px'}}>
                </div>
            </div>
        </section>
    )
}