export const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/data/');
      console.log('la');
      if (!response.ok) {
        console.log('lai');
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('laiw');
      throw new Error('Failed to fetch data');
    }
  };