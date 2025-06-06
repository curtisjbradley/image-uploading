import { useState } from "react";

interface INameEditorProps {
    initialValue: string;
    imageId: string;
    handleUpdate: (id: string, newName: string) => void;
}

export function ImageNameEditor(props: Readonly<INameEditorProps>) {
    const [isEditingName, setIsEditingName] = useState(false);

    const [input, setInput] = useState(props.initialValue);
    const [updating, setUpdating] = useState(false);
    const [errored, setErrored] = useState(false);

    async function handleSubmitPressed() {
        setUpdating(true);
        await fetch(`/api/images/${props.imageId}`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: input})}).then(res => {
            if(!res.ok) {
                setErrored(true);
                return;
            }
            setErrored(false);
            setIsEditingName(false);
        })
        props.handleUpdate(props.imageId, input);
        setUpdating(false);
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name <input value={input} onChange={e => setInput(e.target.value)}/>
                </label>
                <button disabled={input.length === 0 || updating} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {updating && <p>Working...</p>}
                {errored && <p>Ran into an error</p>}
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={() => setIsEditingName(true)}>Edit name</button>
            </div>
        );
    }
}
