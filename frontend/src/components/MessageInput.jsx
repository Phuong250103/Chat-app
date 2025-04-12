import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [textFile, setTextFile] = useState(null); // { name, content }

  const imageInputRef = useRef(null);
  const txtInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn hình ảnh");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTextFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/plain") {
      toast.error("Chỉ hỗ trợ file .txt");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTextFile({
        name: file.name,
        content: reader.result,
      });
    };
    reader.readAsText(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeTextFile = () => {
    setTextFile(null);
    if (txtInputRef.current) txtInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !textFile) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        file: textFile,
      });

      // Reset
      setText("");
      setImagePreview(null);
      setTextFile(null);
      imageInputRef.current.value = "";
      txtInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {(imagePreview || textFile) && (
        <div className="mb-3 flex items-center gap-4 flex-wrap">
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          {textFile && (
            <div className="relative px-3 py-2 border rounded-md bg-base-200">
              <p className="text-sm font-semibold flex items-center gap-1">
                📄 {textFile.name}
              </p>
              <button
                onClick={removeTextFile}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden file inputs */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            accept=".txt"
            className="hidden"
            ref={txtInputRef}
            onChange={handleTextFileChange}
          />

          {/* Button to pick image */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => imageInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* Button to pick .txt file */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${textFile ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => txtInputRef.current?.click()}
          >
            <FileText size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && !textFile}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
