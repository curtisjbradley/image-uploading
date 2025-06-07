import {useActionState, useState} from "react";

interface IUploadProps {
    token: string
    requeryDB: () => void;
}

export function UploadPage(props: IUploadProps) {
    const [imagePreview, setImagePreview] = useState<string>();

    const [result, submitAction, isPending] = useActionState(
        async (_: string | null, formData: FormData) => {
            const file = formData.get("image");
            const name = formData.get("name");
            if(!file || !name){
                return "No file or name";
            }

           const res = await fetch("/api/upload", {method: "POST", body: formData, headers: {
                "Authorization": `Bearer ${props.token}`
                }})

            switch (res.status) {
                case 400:
                    return "Bad upload data"
                case 401:
                    return "Not logged in"
                case 403:
                    return "No permissions"
            }
            props.requeryDB()
            return ""
        },null);


    return (
        <form action={submitAction}>
            <div>
                <label htmlFor={"file_upload"}>Choose image to upload: </label>
                <input id={"file_upload"}
                       disabled={isPending}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    required
                       onChange={(e)=> {
                           if(e.target?.files?.length && e.target.files[0]) {
                               readAsDataURL(e.target.files[0]).then(setImagePreview)
                           }
                       }
                       }
                />

            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input name="name" required />
                </label>

            </div>

            <div> {/* Preview img element */}
                <img style={{width: "20em", maxWidth: "100%"}} src={imagePreview} alt="" />
            </div>

            <input type="submit" value="Confirm upload"  disabled={isPending}/>
            {result === "" && <p>Uploaded!!</p>}
            {result && <p style={{color: "red"}} aria-live={"polite"}>Womp Womp... {result}</p>}
        </form>
    );

    function readAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = (err) => reject(err);
        });
    }
}
