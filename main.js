const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// const currentIndex = 0

const PLAYER_STORAGE_KEY = 'F8_player'
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    songs: [
        {
            name: '3 1 0 7 full album',
            singer: 'W/n, Nâu, Dươngg ',
            path: './mp3/[YT2mp3.info] - W_n - ‘3107’ full album_ ft. ( titie, Nâu ,Dươngg ) (320kbps).mp3',
            img: './img/3107.jpeg',
        },
        {
            name: 'cà phê',
            singer: 'MIN',
            path: './mp3/[YT2mp3.info] - MIN - CÀ PHÊ _ OFFICIAL MUSIC VIDEO (320kbps).mp3',
            img: './img/loi-bai-hat-ca-phe-min-700.jpeg'
        },
        {
            name: 'nàng thơ',
            singer: 'Hoàng Dũng',
            path: './mp3/[YT2mp3.info] - Nàng Thơ _ Hoàng Dũng _ Official MV (320kbps).mp3',
            img: './img/nangtho.jpeg',
        },
        {
            name: 'everything goes on',
            singer: 'Porter Robinson',
            path: './mp3/[YT2mp3.info] - Everything Goes On - Porter Robinson (Official Music Video) _ Star Guardian 2022 (320kbps).mp3',
            img: './img/artworks-Yw5wPTs5WToYx2LM-G2Jk0Q-t500x500.jpeg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './mp3/[YT2mp3.info] - Vicetone - Nevada (ft. Cozi Zuehlsdorff) (320kbps).mp3',
            img: './img/artworks-000168845355-wnya6k-t500x500.jpeg'
        },
        {
            name: 'summer time',
            singer: 'maggie , nyan',
            path: './mp3/[YT2mp3.info] - 麦吉_Maggie x 盖盖Nyan - Summertime (Arrange ver.) (320kbps).mp3',
            img: './img/ab67616d0000b273e0368f9d94588f7f38a905c6.jpeg'
        },
        {
            name: 'ただ声一つ',
            singer: 'ロクデナシ',
            path: './mp3/[YT2mp3.info] - ロクデナシ「ただ声一つ」_ Rokudenashi - One Voice -［Official Music Video］ (320kbps).mp3',
            img: './img/ab67616d0000b273de2d1cf763ed06e6874e1e91.jpeg'
        },
        {
            name: 'home sweet home',
            singer: 'neko hacker , ...',
            path: './mp3/[YT2mp3.info] - Neko Hacker - Home Sweet Home feat. KMNZ LIZ (320kbps).mp3',
            img: './img/maxresdefault.jpeg'
        },
        
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: 
        JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
    
    setconfig: function (key, value) {
        this.config[key] = value;
    localStorage.setItem('PLAYER_STORAGE_KEY', JSON.stringify(this.config))
},

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    handleEvents: function () {
        //? xử lí CD quay 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()



        //? xử lí phóng to thu nhỏ đĩa CD
        const cdwidth = cd.offsetWidth
        const _this = this
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdwidth - scrollTop
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdwidth
        }
        //? xử lí khi chạy play
        playBtn.onclick = function () {

            if (_this.isPlaying) {

                audio.pause()

            } else {

                audio.play()

            }
        }
        //? khi song được play 
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()

        }
        //? khi song pause 
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //? tiến độ bài hát
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }

        }
        //? xử lý khi tua xong 
        progress.onchange = function (e) {
            const seektime = audio.duration / 100 * e.target.value
            audio.currentTime = seektime
            console.log(audio.currentTime)
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setconfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            // _this.playRandomSong()
        }
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setconfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
           

        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            //? sử lí khi chuyển song
           if( songNode
           || e.target.closest('.option')) {


            //? xử lí click vào song
            if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
                _this.render()
            }
            //? xử lí khi click vào option 
           if (e.target.closest('.option')) {}
           }
        }


    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {

            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {

        // console.log(heading, cdThunm, audio)
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom 
        this.isRepeat = this.config.isRepeat 
        
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let NewIndex
        do {
            NewIndex = Math.floor(Math.random() * this.songs.length)

        } while (NewIndex === this.currentIndex) {
            this.currentIndex = NewIndex
            this.loadCurrentSong()
        }
        //? lắng nghe hành vi click vào playlist
    },
   
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200)
    },
    start: function () {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        this.loadConfig()
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)

    },


}
app.start()
