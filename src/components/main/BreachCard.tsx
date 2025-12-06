import Trash from "../../assets/icons/trash.svg" 
import Pencil from "../../assets/icons/pencil.svg"
import type { ExposedResult } from "../../hooks/useBreachManager"

type BreachCardProps = {
  data: ExposedResult;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function BreachCard({ data, onEdit, onDelete }: BreachCardProps) {
  return (
    <div className="result_card">
      <div className="card_header">
        <div>
          <h3>{data.found ? "Email-related leaks" : "No leaks found"}</h3>
          <p className="email_display">{data.email}</p>
        </div>
        <div className="card_actions">
          <button 
            className="edit_btn" 
            onClick={() => onEdit(data.id)} 
            title="Edit"
          >
            <img src={Pencil} alt="Edit" />
          </button>
          <button 
            className="delete_btn" 
            onClick={() => onDelete(data.id)} 
            title="Delete"
          >
            <img src={Trash} alt="Delete" />
          </button>
        </div>
      </div>
      
      {data.found && data.items && data.items.length > 0 ? (
        <>
          <p>Number of occurrences: {data.count}</p>
          
          <ul>
            {data.items.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>We found no public records of leaks for this email address.</p>
      )}
    </div>
  )
}