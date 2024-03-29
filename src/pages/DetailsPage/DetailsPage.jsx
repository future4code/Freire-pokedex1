import { BoxCard, Container, Stat, SmallBox, MediumBox, Move, BigBox, BoxImagem, BoxDetalhes, Type } from "./styles";
import { useParams } from "react-router-dom";
import axios from "axios"
import { useEffect, useState } from "react";
import { ImgType } from "../../utils/ImgType";
import { StatsName } from "../../utils/StatsName";
import PokemonLoading from "../../img/pokemon.png";
import PokemonFront from "../../img/pokemon-front.png";
import PokemonBack from "../../img/pokemon-back.png";
import Header from "../../components/Header/Header";

export default function DetailsPage() {

    const pathParams = useParams();

    const [name, setName] = useState("carregando");
    const [type, setType] = useState(["Loading"]);
    const [moves, setMoves] = useState(["Carregando"]);
    const [stats, setStats] = useState([]);
    const [id, setId] = useState("00");
    const [image, setImage] = useState(PokemonLoading);
    const [frontImg, setFrontImg] = useState(PokemonFront)
    const [backImg, setBackImg] = useState(PokemonBack)
    const [total, setTotal] = useState(0);
   
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if(!loading){
            let total = 0;
            stats.forEach(stat => {
                total += stat.stat;
            })
            setTotal(total)
        }
        getDetails()
    }, [pathParams.nome, loading])



    const getDetails = () => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pathParams.name}`)
            .then((response) => {
                setName(response.data.name)
                setId(response.data.id)

                const types = response.data.types.map((item) => {
                    return item.type.name
                })

                const moves = response.data.moves.map((item) => {
                    return item.move.name
                })

                const stats = response.data.stats.map((item) => {
                    return {nome: item.stat.name,
                            stat: item.base_stat}
                })

                setStats(stats)
                setMoves(moves)
                setType(types)
                setLoading(false)
                setImage(response.data.sprites.other.dream_world.front_default  || response.data.sprites.other.home.front_default)
                setFrontImg(response.data.sprites.front_default)
                setBackImg(response.data.sprites.back_default)
            }).catch((error) => {
                setName("Pokemon não encontrado")
                
                setStats(["error"])
                setMoves(["error"])
                setType(["error"])
                setLoading(false)
                console.log(error);
            })
    }

    return (

        <>
        <Header/>
        <main>
        <Container>
            <h1>Detalhes</h1>
            <BoxCard className="cardColor" id={type[0]}>
                <SmallBox id="box1">
                    <img src={frontImg} alt="" />
                </SmallBox>
                <SmallBox id="box2">
                    <img src={backImg} alt="" />
                </SmallBox>
                <MediumBox id="box4">
                    <h2>Moves:</h2>
                    {moves && moves.slice(0, 8).map((move) => {
                  return (
                    <Move key={move}>
                      <p>{move.split("-").join(" ")}</p>
                    </Move>
                  );
                })}
                </MediumBox>
                <BigBox id="box3">
                    <h2>Base stats</h2>
                    {stats && stats.map((stat, i) => {
                        return (
                            <Stat key={i} width={stat.stat}>
                                <span id="statName">{StatsName(stat.nome)}</span>
                                <span>{stat.stat}</span>
                                <div></div>
                            </Stat>
                        )
                    })}
                    <Stat width={total}><span id="statName">Total:</span><span>{total}</span></Stat>
                </BigBox>              
               
                <BoxDetalhes>
                    <div id="detals">
                        <p>#{id}</p>
                        <h2>{name.split("-").join(" ")}</h2>

                        <div id="type">
                            {type.map((type) => {
                                return (
                                    <Type key={type} id={type}>
                                        {ImgType(type)}
                                        <p>{type}</p>
                                    </Type>
                                );
                            })}

                        </div>
                    </div>

                    </BoxDetalhes>
                    <img src={image} alt={name} />
                </BoxCard>
            </Container>
        </main>
        </>
    )
}
