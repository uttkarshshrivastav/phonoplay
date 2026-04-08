
var playlist = []
var currentSongIndex = -1
var audio = new Audio()
var isPlaying = false


function loadSong(index) {
    if (index < 0 || index >= playlist.length) {
        console.log("Invalid song index")
        return
    }
    
    currentSongIndex = index
    var song = playlist[index]
    audio.src = song.url
    
    document.getElementById('currentSongName').textContent = song.name
    updatePlaylistUI()
    
    localStorage.setItem('lastSongIndex', currentSongIndex)
}

function togglePlay() {
    if (currentSongIndex === -1 && playlist.length > 0) {
        loadSong(0)
    }
    
    if (audio.src === "") {
            ("Please upload some songs first")
        return
    }
    
    if (isPlaying) {
        audio.pause()
        isPlaying = false
        document.getElementById('playBtn').textContent = "Play"
    } else {
        audio.play()
        isPlaying = true
        document.getElementById('playBtn').textContent = "Pause"
    }
}

function nextSong() {
    if (playlist.length === 0) return
    
    var shuffleMode = document.getElementById('shuffleToggle').checked
    
    if (shuffleMode) {
        var nextIndex = Math.floor(Math.random() * playlist.length)
        loadSong(nextIndex)
    } else {
        var nextIndex = currentSongIndex + 1
        if (nextIndex >= playlist.length) {
            nextIndex = 0
        }
        loadSong(nextIndex)
    }
    
    if (isPlaying) {
        audio.play()
    }
}

function previousSong() {
    if (playlist.length === 0) return
    
    var prevIndex = currentSongIndex - 1
    if (prevIndex < 0) {
        prevIndex = playlist.length - 1
    }
    
    loadSong(prevIndex)
    
    if (isPlaying) {
        audio.play()
    }
}

audio.addEventListener('timeupdate', function() {
    if (audio.duration) {
        var progress = (audio.currentTime / audio.duration) * 100
        document.getElementById('progressBar').value = progress
        
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime)
        document.getElementById('duration').textContent = formatTime(audio.duration)
        
        // Save position
        localStorage.setItem('lastPosition', audio.currentTime)
    }
})

document.getElementById('progressBar').addEventListener('input', function(e) {
    if (audio.duration) {
        var time = (e.target.value / 100) * audio.duration
        audio.currentTime = time
    }
})

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00"
    var mins = Math.floor(seconds / 60)
    var secs = Math.floor(seconds % 60)
    return mins + ":" + (secs < 10 ? "0" : "") + secs
}


audio.addEventListener('ended', function() {
    var loopMode = document.getElementById('loopToggle').checked
    
    if (loopMode) {
        // Loop current song
        audio.currentTime = 0
        audio.play()
    } else {
        nextSong()
    }
})

function uploadSongs() {
    var input = document.getElementById('songInput')
    var files = input.files
    
    if (files.length === 0) {
        alert("Please select some audio files")
        return
    }
    
    for (var i = 0; i < files.length; i++) {
        var file = files[i]
        var song = {
            name: file.name,
            url: URL.createObjectURL(file)
        }
        playlist.push(song)
        console.log("Added song:", file.name)
    }
    
    updatePlaylistUI()
    input.value = ""
    
    if (playlist.length === files.length) {
        loadSong(0)
    }

}

function updatePlaylistUI() {
    var list = document.getElementById('playlist')
    list.innerHTML = ""
    
    for (var i = 0; i < playlist.length; i++) {
        var li = document.createElement('li')
        li.textContent = playlist[i].name
        li.style.cursor = "pointer"
        
        // Highlight current song
        if (i === currentSongIndex) {
            li.style.backgroundColor = "#4a90e2"
            li.style.color = "white"
        }
        
        
        li.onclick = (function(index) {
            return function() {
                loadSong(index)
                isPlaying = false
                togglePlay()
            }
        })(i)
        
        list.appendChild(li)
    }
}
window.onload = function() {
    var savedIndex = localStorage.getItem('lastSongIndex')
    var savedPosition = localStorage.getItem('lastPosition')
    
    console.log("Restoring session...", savedIndex, savedPosition)
}
