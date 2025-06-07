import {useState} from "react";

export function UploadPage() {
    const [imagePreview, setImagePreview] = useState<string>();


    return (
        <form>
            <div>
                <label htmlFor={"file_upload"}>Choose image to upload: </label>
                <input id={"file_upload"}
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

            <input type="submit" value="Confirm upload" />
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
