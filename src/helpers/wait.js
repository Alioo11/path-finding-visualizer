
export const onWaiting = (waitingTime) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve();
      },
      waitingTime ? waitingTime : 30
    );
  });
};

export const onPause = () => {
  return new Promise((resolve, reject) => {
    //
  });
};
