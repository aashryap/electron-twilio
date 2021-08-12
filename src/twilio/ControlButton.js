export const ControlButton = ({
    icon,
    onClick,
    label,
    className
}) => {
    return (
        <div>
            <div onClick={onClick} className={`inline-block rounded-full shadow-md bg-white h-12 w-12 flex items-center justify-center ${className} mb-2`}>
                <span className={`fas cursor-pointer ${icon}`}></span> 
            </div>
            <div className="text-center">{label}</div>
        </div>
    )
}