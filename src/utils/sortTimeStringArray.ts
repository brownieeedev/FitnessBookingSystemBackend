let sortedTimes: string[] = [];
if (selectedHours.length > 1) {
  sortedTimes = [...selectedHours].sort((a, b) => {
    const [hoursA, minutesA] = a.split(":").map(Number);
    const [hoursB, minutesB] = b.split(":").map(Number);
    return hoursA - hoursB || minutesA - minutesB;
  });
}
