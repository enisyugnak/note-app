import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import "./style.css"




export default function App() {
    /** 
     * 
     *  Lazy state initialization
     * state icine fonksiyon tanımlayarak, 
     * sadece bir kez çağrılmasını sağlıyoruss.
     * 
     */

    const [notes, setNotes] = React.useState(()=> getLocalNotes() || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    

    React.useEffect(()=>{
        localStorage.setItem("notes",JSON.stringify(notes))
    },[notes])


    function getLocalNotes(){
        //localStorage.clear();
        return JSON.parse(localStorage.getItem("notes"));
    }

    function createNewNote() {

        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {

        setNotes(oldNotes => {
            let newArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i];
                if(oldNote.id === currentNoteId){
                    newArray.unshift({ ...oldNote, body: text })
                }else{
                    newArray.push(oldNote)
                }

            }
            return newArray
        })


        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))

      //  let upNote = notes.find(item=> currentNoteId === item.id)
      //  setNotes(oldNotes => oldNotes.filter(item=> currentNoteId !== item.id ))
      //  setNotes(oldNotes => [upNote,...oldNotes]);
    }
    
    /**
     * Challenge: complete and implement the deleteNote function
     * 
     * Hints: 
     * 1. What array method can be used to return a new
     *    array that has filtered out an item based 
     *    on a condition?
     * 2. Notice the parameters being based to the function
     *    and think about how both of those parameters
     *    can be passed in during the onClick event handler
     */

    function deleteNote(event, noteId) {
        event.stopPropagation()
        
        setNotes(oldNotes=> oldNotes.filter(note=> note.id !== noteId))

        console.log("delete",noteId)
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
