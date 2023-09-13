import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../constant';

interface Collection {
  id: string;
  displayName: string;
  isVisible: boolean;
  items: Collection[];
}

const CMSOptimizationPage: React.FC = () => {
  const { siteID } = useParams<{ siteID: string }>();
  const authToken = localStorage.getItem('token');
  const [collectionList, setCollectionList] = useState<Collection[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const accordionContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    populateHTML();
  }, []);

  const fetchData = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const toggleVisibility = (element: Collection) => {
    setCollectionList((prevList) => prevList.map((collection) =>
      collection.id === element.id
        ? { ...collection, isVisible: !collection.isVisible }
        : collection
    ));
  };

  const createAccordionItem = (collection: Collection) => {
    const title = (
      <h2 className="text-lg font-medium text-black">{collection.displayName}</h2>
    );

    const content = (
      <div className={`px-4 py-2 bg-gray-100 ${collection.isVisible ? '' : 'hidden'}`}>
        {collection.items.map((item) => (
          <div className="flex items-center" key={item.id}>
            <input type="checkbox" className={`form-checkbox-${collection.id}`} />
            <p className="ml-2 text-black" >{item.displayName}</p>
          </div>
        ))}
      </div>
    );

    return (
      <div className="border border-gray-300 rounded-lg" key={collection.id}>
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleVisibility(collection)}>
          {title}
        </div>
        {content}
      </div>
    );
  };

  const optimizeImages = async () => {
    if (collectionList.length > 0) {
      let totalSize = 0;
      let optimizedSize = 0;
      const selectedItems: any[] = [];

      for (const collection of collectionList) {
        setIsOptimizing(true);
        const checkboxes = accordionContainerRef.current!.querySelectorAll(`.form-checkbox-${collection.id}`);
        const selectedItemsInCollection = Array.from(checkboxes)
          .filter((checkbox) => (checkbox as HTMLInputElement).checked)
          .map((checkbox) => ({
            collectionId: collection.id,
            itemName: checkbox.parentElement!.querySelector("p")!.innerText,
          }));

        selectedItems.push(...selectedItemsInCollection);
      }

      const uniqueCollections = [...new Set(selectedItems.map((item) => item.collectionId))];
      for (const collectionId of uniqueCollections) {
        const fields = selectedItems
          .filter((item) => item.collectionId === collectionId)
          .map((item) => item.itemName);

        const bodyContent = JSON.stringify(fields);

        try {
          const response = await fetchData(`${BASE_URL}/optimizeItems?collection_id=${collectionId}`, {
            method: 'POST',
            headers: {
              'authorization': `Bearer ${authToken}`,
              'content-type': 'application/json',
            },
            body: bodyContent,
          });

          const optimizedImageList = response;

          optimizedImageList.forEach((item: any) => {
            totalSize += item.originalSize;
            optimizedSize += item.optimizedSize;
          });

          document.getElementById('from')!.innerText = formatBytes(totalSize);
          document.getElementById('to')!.innerText = formatBytes(optimizedSize);

          setIsOptimizing(false);
          setDone(true);
        } catch (error) {
          console.error(error);
          setIsOptimizing(false);
          setDone(false);
        }
      }
    }
  };

  const populateHTML = async () => {
    try {
      const result = await fetchData(`${BASE_URL}/getCollections?site_id=${siteID}`, {
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
        },
      });

      const list = result.collections;

      for (let i = 0; i < list.length; i++) {
        list[i]['isVisible'] = false;
        const itemList = await fetchData(`${BASE_URL}/getCollectionDetails?collection_id=${list[i].id}`, {
          headers: {
            'authorization': `Bearer ${authToken}`,
            'content-type': 'application/json',
          },
        });

        list[i]['items'] = itemList;
      }

      setCollectionList(list);
    } catch (error) {
      console.error(error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / 1048576).toFixed(2) + " MB";
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">CMS Collections</h1>

      <div id="accordionContainer" className="space-y-2" ref={accordionContainerRef}>
        {collectionList.map((collection) => createAccordionItem(collection))}
      </div>

      <div className="mt-4">
        <button
          id="optimizeButton"
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring ${isOptimizing ? 'cursor-not-allowed' : ''}`}
          onClick={optimizeImages}
          disabled={isOptimizing}
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize'}
        </button>
      </div>

      <div className={`text-black flex items-center optimize-result-container ${!done ? 'hidden' : ''} mt-2 justify-end`}>
        <span className="material-symbols-outlined mr-2 text-green-500">check_circle</span>
        Image optimized from <span className="font-semibold text-red-500 ml-1 mr-1" id="from">0KB</span> to <span className="font-semibold text-green-500 ml-1" id="to">0KB</span>
      </div>
    </div>
  );
};

export default CMSOptimizationPage;
