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
