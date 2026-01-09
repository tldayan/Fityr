import { BASE_URL } from "@/_lib/apiEndpoints";

export const uploadImagesToS3 = async (media: File[]) => {
  return Promise.all(
    media.map(async (file) => {
      const res = await fetch(`${BASE_URL}/aws/uploadPostImages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: file.type }),
      });

      const { uploadUrl, imageUrl } = await res.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      return imageUrl;
    })
  );
};

