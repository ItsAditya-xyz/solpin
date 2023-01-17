export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export function timeStampToTimeAgo(p_timeStampNanoSeconds) {
  const milliseconds = p_timeStampNanoSeconds / 1000000;
  const durationUntilNowInMilliseconds = new Date().getTime() - milliseconds;
  const durationInMinutes = durationUntilNowInMilliseconds / 1000 / 60;

  if (durationInMinutes < 60) {
    return Math.floor(durationInMinutes) + "m";
  }

  const durationInHours = durationInMinutes / 60;

  if (durationInHours < 24) {
    return Math.floor(durationInHours) + "h";
  }

  const durationInDays = durationInHours / 24;

  return Math.floor(durationInDays) + "d";
}
