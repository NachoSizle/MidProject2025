window.onload = async () => {
  const projectsRes = await fetch(
    "https://mid-project-nacho.netlify.app/api/projects"
  );
  console.log(projectsRes);
  const projects = await projectsRes.json();
  console.log(projects);
};
