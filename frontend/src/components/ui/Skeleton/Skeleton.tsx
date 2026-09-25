import "./Skeleton.css";

interface SkeletonProps {
    className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <span
            className={`skeleton ${className}`}
            aria-hidden="true"
        />
    );
}

export default Skeleton;