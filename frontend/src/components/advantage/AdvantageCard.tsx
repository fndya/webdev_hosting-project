interface AdvantageCardProps {
    icon: string;
    title: string;
    description: string;
}

function AdvantageCard({icon, title, description}: AdvantageCardProps) {
    return (
        <article className="advantage">
            <div className="advantage-title">
                <span className="icon">
                    <img src={icon}></img>
                </span>
                <h3>{title}</h3>
            </div>
            <p>{description}</p>
        </article>
    );
}

export default AdvantageCard;