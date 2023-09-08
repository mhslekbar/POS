// START Socket
// import io from 'socket.io-client';
// export const socket = io.connect('http://localhost:9000');
// END Socket

export const Timeout = 1500

export const hideMsg = (e, error, setError) => {
  const theMsg = e.target.innerText;
  setError(error.filter((err) => err?.toUpperCase()?.trim() !== theMsg?.toUpperCase()?.trim()));
};

export const formatDate = (dateString) => {
  if(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const theDate = new Date(dateString).toLocaleDateString('en-US', options);
    const arrDate = theDate.split("/")
    return `${arrDate[1]}/${arrDate[0]}/${arrDate[2]}`;
  }
};

export const formattedDate = (dateString) => {
  if(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const theDate = new Date(dateString).toLocaleDateString('en-US', options);
    const arrDate = theDate.split("/")
    return `${arrDate[2]}-${arrDate[0]}-${arrDate[1]}`;
  }
};

export const removeComma = (num) => {
  return parseInt(num) - num === 0 ? parseInt(num) : num.toFixed(2)
}

export const lenOfFacture = (num) => {
  switch(num.length) {
    case 1: return `000${num}`; 
    case 2: return `00${num}`; 
    case 3: return `0${num}`; 
    case 4: return `${num}`; 
    default: return num
  }
}

export const getRemainingDays = (dateString) => {
  if(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();
    const differenceInTime = givenDate.getTime() - now.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const remainingDays = Math.ceil(differenceInDays);
  
    if(remainingDays < 7) {
      return `${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
    } else if(remainingDays < 30) {
      const numWeek = remainingDays / 7
      const days  = Math.ceil(numWeek) % 10
      return `${parseInt(numWeek)} semaine${numWeek > 1 ? "s" : ""} ${days} jour${days > 1 ? "s" : ""}`;
    } else if(remainingDays < 365) {
      const numMonth = remainingDays / 30
      const days  = Math.ceil(numMonth) % 10
      if(numMonth < 12) {
        return `${parseInt(numMonth)} mois ${days} jour${days > 1 ? "s" : ""}`;
      } else {
        const numYear = numMonth / 12
        return `${numYear}an${numYear > 1 ? "s" : ""} ${parseInt(numMonth)} mois ${days} jour${days > 1 ? "s" : ""}`;
      }
    } else {
      return `${remainingDays} jours`
    }
  }
}


export const COLORS = [
  "#ff4757",
  "#5352ed",
  "#70a1ff",
  "#f45e437d",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#2d3436",
  "#00b894",
  "#e17055",
  "#f9ca24",
  "#d63031",
  "#a29bfe",
  "#6ab04c",
  "#4834d4",
  "#f0932b",
  "#130f40",
  "#95afc0",
  "#205fe6",
  "#28deba",
  "#b9d79a",
  "#b32252",
  "#3a0d0d",
  "#f1e616",
  "#574f39",
  "#b32222",
  "#7b22b3",
  "#7b00ff",
  "#ffee00",
];