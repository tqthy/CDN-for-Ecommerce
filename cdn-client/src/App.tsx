import { useState } from "react";

function App() {
  const [status, setStatus] = useState<string>("No uploads");

  const upload = () => {
    // Get selected files from the input element.
    const fileInput = document.querySelector<HTMLInputElement>("#selector");
    if (!fileInput || !fileInput.files) return;

    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Retrieve a URL from our server.
      retrieveNewURL(file, (file, url) => {
        // Upload the file to the server.
        uploadFile(file, url);
      });
    }
  };

  // `retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
  // generate a pre-signed URL for use in uploading that file.
  const retrieveNewURL = async (file: File, cb: (file: File, url: string) => void) => {
    try {
      const response = await fetch(`http://origin:3000/api/file/upload?contentType=${file.type}`);
      const obj = await response.json();
      const url = obj.result.presignedUrl;
      // const blob = new Blob([file], { type: file.type });
      // const newFile = new File([blob], obj.result.fileName, { type: file.type });
      cb(file, url);
    } catch (e) {
      console.error(e);
    }
  };

  // `uploadFile` accepts the current filename and the pre-signed URL. It then uses `Fetch API`
  // to upload this file to S3 at `play.min.io:9000` using the URL.
  const uploadFile = async (file: File, url: string) => {
    try {
      if (status === "No uploads") {
        setStatus("");
      }
      await fetch(url, {
        method: "PUT",
        body: file,
      });
      // Update the status to show uploaded files
      setStatus((prevStatus) => `${prevStatus}<br>Uploaded ${file.name}.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <input type="file" id="selector" multiple />
      <button onClick={upload}>Upload</button>
      <div id="status" dangerouslySetInnerHTML={{ __html: status }}></div>
    </div>
  );
}

export default App;