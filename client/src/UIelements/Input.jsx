export const Input = (props)=>{
    return (
        <input
            {...props}
            type={props.type || "text"}
            placeholder={props.placeholder || ""}
        />
    );
}