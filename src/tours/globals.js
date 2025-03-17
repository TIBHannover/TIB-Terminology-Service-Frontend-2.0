export function tourWelcomeStep() {
  const steps = [
    {
      selector: 'welcome-message',
      content: () => {
        return (
          <>
            <span>
              Welcome to TIB Terminology Service. Would you like to take a tour in our Service?
              If yes, please proceed by choosing the next step <i class="fa fa-solid fa-arrow-right"></i>.
              <br />
              (You can also use left/right arrow keys on your keyboard.)
            </span>
            <br />
            <br />
            <span>You can skip this by closing this box.</span>
            <br />
            <br />
            <span>You can always re-run this tour later by clicking on <b>Guide me</b> on the right.</span>
          </>
        )
      }
    },
  ];
  return steps;
}
