import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="projects-img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
