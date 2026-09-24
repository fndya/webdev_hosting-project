interface TariffParameterProps {
  icon: string;
  label: string;
  value: string;
}

function TariffParameter({
  icon,
  label,
  value,
}: TariffParameterProps) {
  return (
    <div className="tariff-row tariff-detail-row">
      <span className="tariff-icon">
        <img src={icon} alt="" />
      </span>

      <strong>{label}</strong>

      <span>{value}</span>
    </div>
  );
}

export default TariffParameter;