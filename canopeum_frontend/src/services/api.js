export const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/data/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error fetching data:', error);
    }
  };