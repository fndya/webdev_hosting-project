interface AccountSectionHeaderProps {
    title: string;
    description: string;
}

function AccountSectionHeader({
    title,
    description,
}: AccountSectionHeaderProps) {
    return (
        <header className="account-header">
            <span className="account-eyebrow">
                Личный кабинет
            </span>
            <h1>{title}</h1>
            <p>{description}</p>
        </header>
    );
}

export default AccountSectionHeader;