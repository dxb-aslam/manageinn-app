/**
 * useImageUpload — Capacitor Camera + Frappe upload_file.
 *
 * Usage:
 *   const { pickAndUpload, uploading, error } = useImageUpload();
 *
 *   async function setRoomPhoto(room) {
 *     const url = await pickAndUpload();
 *     if (url) {
 *       await api('manageinn.api.update_room', {
 *         name: room.name,
 *         payload: { photo: url },
 *       });
 *     }
 *   }
 *
 * Flow:
 *   1. Capacitor.Camera.getPhoto({ source: Prompt }) — user picks camera
 *      or gallery via the native action sheet
 *   2. Receive a base64 string + format
 *   3. Convert to Blob → FormData
 *   4. POST to /api/method/upload_file with the auth header (token)
 *   5. Return the resulting file_url
 *
 * On web (PWA / dev server), Capacitor.Camera falls back to a file
 * picker dialog automatically, so this works in both targets.
 */
import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { apiUrl } from '@/services/site';
import { readCreds } from '@/services/http';
export function useImageUpload() {
    const uploading = ref(false);
    const error = ref('');
    /**
     * Prompt the user to pick an image (camera or gallery), upload it to
     * the bench, return the resulting file_url. Returns null if the user
     * cancelled or anything failed (error message stashed in `error.value`).
     */
    async function pickAndUpload(opts = {}) {
        const quality = opts.quality ?? 80;
        const folder = opts.folder ?? 'Home/Attachments';
        error.value = '';
        uploading.value = true;
        try {
            // 1. Pick the image. CameraSource.Prompt → action sheet on native
            //    (Camera / Gallery / Cancel). Falls back to file input on web.
            const photo = await Camera.getPhoto({
                quality,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Prompt,
                promptLabelHeader: 'Photo',
                promptLabelPhoto: 'From gallery',
                promptLabelPicture: 'Take photo',
            });
            if (!photo.base64String) {
                error.value = 'No image returned';
                return null;
            }
            // 2. Convert base64 → Blob
            const blob = base64ToBlob(photo.base64String, photo.format);
            const filename = `upload-${Date.now()}.${photo.format || 'jpg'}`;
            // 3. Build multipart FormData. Note: Capacitor's CapacitorHttp
            //    DOESN'T support FormData reliably on Android, so we use the
            //    native fetch for upload. CORS isn't an issue here because
            //    the upload endpoint accepts the token via Authorization header
            //    + we set the correct cross-site headers.
            const form = new FormData();
            form.append('file', blob, filename);
            form.append('is_private', '0');
            form.append('folder', folder);
            const creds = await readCreds();
            if (!creds) {
                error.value = 'Not signed in';
                return null;
            }
            const url = await apiUrl('/api/method/upload_file');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `token ${creds.api_key}:${creds.api_secret}`,
                },
                body: form,
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                error.value = `Upload failed (${res.status}) ${text.slice(0, 120)}`;
                return null;
            }
            const data = await res.json();
            const fileUrl = data?.message?.file_url || data?.file_url;
            if (!fileUrl) {
                error.value = 'Upload succeeded but no URL returned';
                return null;
            }
            return fileUrl;
        }
        catch (e) {
            // Capacitor throws a specific code when the user cancels — swallow it.
            if (e?.message?.includes('cancel') || e?.message?.includes('User cancelled')) {
                return null;
            }
            error.value = e?.message || 'Could not upload image';
            return null;
        }
        finally {
            uploading.value = false;
        }
    }
    return { pickAndUpload, uploading, error };
}
/**
 * Convert a base64 string (no data-URL prefix) into a Blob suitable for
 * FormData upload. Format defaults to jpeg.
 */
function base64ToBlob(base64, format = 'jpeg') {
    const byteString = atob(base64);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = byteString.charCodeAt(i);
    }
    const mimeMap = {
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
    };
    return new Blob([bytes], { type: mimeMap[format] || 'image/jpeg' });
}
