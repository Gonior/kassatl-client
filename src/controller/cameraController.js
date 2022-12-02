
export class CameraController {
    
    async startVideo() {
        return await navigator.mediaDevices.getUserMedia({video : { facingMode : 'environment'}});
    }

    getSize(e) {
        return e/1024/1024
    }

    getImage(file, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            let image = new Image()
            image.src = e.target.result
            image.onload = async function() {
                callback(image)
            }
        };
    }

    takePicture(source) {
        let canvas = document.createElement('canvas')
        canvas.width = source.videoWidth
        canvas.height = source.videoHeight
        canvas.getContext('2d').drawImage(source,0,0)
        return canvas
    }

    stopVideo(stream) {
        try {
            stream.getTracks().forEach(function(track) {
			    track.stop();
    	    });
        } catch (err) {
            console.log(err)
        }
    }
}