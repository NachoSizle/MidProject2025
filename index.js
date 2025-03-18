window.onload = async () => {
  const projectsRes = await fetch("http://localhost:3000/projects");
  const projects = await projectsRes.json();
  console.log(projects);
};
