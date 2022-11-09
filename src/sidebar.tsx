import React from "react";
import ImageToPieces from 'image-to-pieces';
import {createCards, getViewport, Viewport} from "@whiteboards-io/plugins";


export default function Sidebar() {
    const [imageUrl, setImageUrl] = React.useState();
    const imgRef = React.useRef();
    const [columns, setColumns] = React.useState(5);
    const [rows, setRows] = React.useState(5);

    return <>
        <h1 style={{margin: "0px 0 0 40px"}}>Generate Jigsaw Puzzle</h1>
        <h3>Step 1: Image upload</h3>
        <input accept="image/*" type="file" onChange={event => {
            const [file] = event.target.files
            if (file) {
              setImageUrl(URL.createObjectURL(file));
            }
        }} />

        <h3>Step 2: Preview image</h3>
        {imageUrl ? <img alt="" ref={imgRef} src={imageUrl} /> : "Image not loaded!"}

        <h3>Step 3: Specify</h3>
        Columns: <input type="number" value={columns} onChange={event => setColumns(event.target.value)} /><br/>
        Rows: <input type="number"value={rows} onChange={event => setRows(event.target.value)} />
        
        <h3>Step 4: Add Puzzles to Whiteboard</h3>
    <button disabled={!imageUrl || !rows || !columns} onClick={async () => {
        const tileWidth = imgRef.current.width / columns;
        const tileHeight = imgRef.current.height / rows;
         
        const Image = new ImageToPieces(imgRef.current, columns, rows);
        const tiles = Image.getTiles();
        const viewport = await getCurrentViewport();
        createCards(tiles.map((tile) => ({
            x: viewport.location[0] + Math.random() * (tileWidth / viewport.zoom * Math.random() * columns),
            y: viewport.location[1] + Math.random() * (tileHeight / viewport.zoom * Math.random() * rows),
            width: tileWidth / viewport.zoom,
            height: tileHeight / viewport.zoom,
            props: {
                dataURL: tile.data + "#image/png",
                originalWidth: tileWidth,
                originalHeight: tileHeight,
                shadowDisabled: true
            }
        })));
    }}>Generate Puzzle</button></>;
}

async function getCurrentViewport() {
    const {zoom, rectX, rectY, rectMaxX, rectMaxY}: Viewport = await getViewport();
    return {zoom, location: [(rectX + rectMaxX) / 2, (rectY + rectMaxY) / 2] as [number, number]} as const;
}
