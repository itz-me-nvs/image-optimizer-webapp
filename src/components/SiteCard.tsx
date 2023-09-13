
import { NavLink } from "react-router-dom";

export type siteType = {
    id: string,
    displayName: string,
    previewUrl: string
}


const SiteCard = (site : siteType) => {
  const { id, displayName, previewUrl } = site;

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg shadow-lg" key={id}>
        <NavLink
        to={`sites/${id}`}

        >
 <img src={previewUrl} alt={displayName} className="w-full h-30 object-cover rounded-t-lg" />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
        </div>
        </NavLink>

    </div>
  );
};

export default SiteCard;
