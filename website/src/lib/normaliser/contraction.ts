// https://en.wikipedia.org/wiki/Wikipedia:List_of_English_contractions

export const CONTRACTIONS: Array<[RegExp, string]> = [
  [/^a'ight$/i, 'alright'],
  [/^ain't$/i, 'aint'],
  [/^amn't$/i, 'am not'],
  [/^aren't$/i, 'are not'],
  [/^'bout$/i, 'about'],
  [/^can't$/i, 'cannot'],
  [/^'cause$/i, 'because'],
  [/^cuz$/i, 'because'],
  [/^'cept$/i, 'except'],
  [/^c'mon$/i, 'come on'],
  [/^could've$/i, 'could have'],
  [/^couldn't$/i, 'could not'],
  // couldn’t’ve 	could not have
  [/^cuppa$/i, 'cup of'],
  // daren’t 	dare not / dared not
  // daresn’t 	dare not
  // dasn’t 	dare not
  [/^didn't$/i, 'did not'],
  [/^doesn't$/i, 'does not'],
  [/^don't$/i, 'do not'],
  [/^dunno$/i, 'do not know'],
  // d’ye (informal) 	do you / did you
  // d’ya (informal) 	do you / did you
  // e’en (poetic) 	even
  // e’er (poetic) 	ever
  // ’em (informal) 	them
  [/^everybody's$/i, 'everybody is'],
  [/^everyone's$/i, 'everyone is'],
  [/^everything's$/i, 'everything is'],
  // finna (informal) 	fixing to
  // fo’c’sle (informal) 	forecastle
  [/^'gainst$/i, 'against'],
  // g’day (informal) 	good day
  [/^gimme$/i, 'give me'],
  // gimme (informal) 	give me
  // giv’n (informal) 	given
  // gi’z (informal) 	give us (colloquial, meaning: give me)
  [/^gonna$/i, 'going to'],
  // gon’t (informal) 	go not (colloquial)
  [/^gotta$/i, 'got to'],
  [/^hadn't$/i, 'had not'],
  // had’ve 	had have
  [/^hasn't$/i, 'has not'],
  [/^haven't$/i, 'have not'],
  [/^he'd$/i, 'he would'],
  [/^he'll$/i, 'he will'],
  // helluva (informal) 	hell of a
  // yes'nt (informal) 	yes not / no
  [/^he's$/i, 'he is'],
  [/^here's$/i, 'here is'],
  // how’d (informal) 	how did / how would
  // howdy (informal) 	how do you do / how do you fare
  [/^how'll$/i, 'how will'],
  [/^how're$/i, 'how are'],
  [/^how's$/i, 'how is'],
  [/^i'd$/i, 'i would'],
  // I’d’ve 	I would have
  // I’d’nt 	I would not
  // I’d’nt’ve 	I would not have
  // If’n (informal) 	If and when
  [/^i'll$/i, 'i will'],
  [/^i'm$/i, 'i am'],
  [/^imma$/i, 'i am going to'],
  // I’m’o (informal) 	I am going to
  // innit (informal) 	isn’t it / ain’t it
  // Ion (informal) 	I do not / I don't
  [/^i've$/i, 'i have'],
  [/^isn't$/i, 'is not'],
  [/^it'd$/i, 'it would'],
  [/^it'll$/i, 'it will'],
  [/^it's$/i, 'it is'],
  // Idunno (informal) 	I do not know
  // kinda (informal) 	kind of
  [/^let's$/i, 'let us'],
  // loven’t (informal) 	love not (colloquial)
  // ma’am (formal) 	madam
  [/^mayn't$/i, 'may not'],
  [/^may've$/i, 'may have'],
  [/^mightn't$/i, 'might not'],
  [/^might've$/i, 'might have'],
  [/^mine's$/i, 'mine is'],
  [/^mustn't$/i, 'must not'],
  [/^must've$/i, 'must have'],
  // ’neath (informal) 	beneath
  [/^needn't$/i, 'need not'],
  // nal (informal) 	and all
  // ne’er (informal) 	never
  // o’clock 	of the clock
  // o’er 	over
  [/^ol'$/i, 'old'],
  // ought’ve 	ought have
  // oughtn’t 	ought not
  // oughtn’t’ve 	ought not have
  [/^'round$/i, 'around'],
  // ’s 	is, has, does, us / possessive
  // shan’ 	shall not
  // shan’t 	shall not
  [/^she'd$/i, 'she would'],
  [/^she'will$/i, 'she will'],
  [/^she's$/i, 'she is'],
  [/^should've$/i, 'should have'],
  [/^shouldn't$/i, 'should not'],
  // shouldn’t’ve (informal) 	should not have
  [/^somebody's$/i, 'somebody is'],
  [/^someone's$/i, 'someone is'],
  [/^something's$/i, 'something is'],
  // so’re (informal) 	so are (colloquial)
  // so’s (informal) 	so is / so has
  // so’ve (informal) 	so have
  [/^that'll$/i, 'that will'],
  [/^that're$/i, 'that are'],
  [/^that's$/i, 'that is'],
  [/^that'd$/i, 'that would'],
  [/^there'd$/i, 'there would'],
  [/^there'll$/i, 'there will'],
  [/^there're$/i, 'there are'],
  [/^there's$/i, 'there is'],
  [/^these're$/i, 'these are'],
  [/^these've$/i, 'these have'],
  [/^they'd$/i, 'they would'],
  // they’d've 	they would have / they could have / they should have
  [/^they'll$/i, 'they will'],
  [/^they're$/i, 'they are'],
  [/^they've$/i, 'they have'],
  [/^this's$/i, 'this is'],
  // those’re (informal) 	those are
  // those’ve (informal) 	those have
  // ’thout (informal) 	without
  [/^'til$/i, 'until'],
  [/^'tis$/i, 'it is'],
  [/^to've$/i, 'to have'],
  // to’ve (informal) 	to have
  [/^tryna$/i, 'trying to'],
  [/^'twas$/i, 'it was'],
  [/^'tween$/i, 'between'],
  [/^'twere$/i, 'it were'],
  [/^w'all$/i, 'we all'],
  [/^w'at$/i, 'we at'],
  [/^wanna$/i, 'want to'],
  [/^wasn't$/i, 'was not'],
  [/^we'd$/i, 'we would'],
  // we’d’ve 	we would have
  [/^we'll$/i, 'we will'],
  [/^we're$/i, 'we are'],
  [/^we've$/i, 'we have'],
  [/^weren't$/i, 'were not'],
  [/^whatcha$/i, 'what are you'],
  [/^what'd$/i, 'what did'],
  [/^what'll$/i, 'what will'],
  [/^what're$/i, 'what are'],
  [/^what's$/i, 'what is'],
  [/^what've$/i, 'what have'],
  [/^when'd$/i, 'when did'],
  [/^when's$/i, 'when is'],
  [/^where'd$/i, 'where did'],
  [/^where'll$/i, 'where will'],
  [/^where're$/i, 'where are'],
  [/^where's$/i, 'where is'],
  [/^where've$/i, 'where have'],
  [/^which'd$/i, 'which would'],
  [/^which'll$/i, 'which will'],
  [/^which're$/i, 'which are'],
  [/^which's$/i, 'which is'],
  [/^which've$/i, 'which have'],
  [/^who'd$/i, 'who would'],
  // who’d’ve 	who would have
  [/^who'll$/i, 'who will'],
  [/^who're$/i, 'who are'],
  [/^who's$/i, 'who is'],
  [/^who've$/i, 'who have'],
  [/^why'd$/i, 'why did'],
  [/^why're$/i, 'why are'],
  // why’s 	why has / why is / why does
  [/^won't$/i, 'will not'],
  [/^would've$/i, 'would have'],
  [/^wouldn't$/i, 'would not'],
  // wouldn’t’ve 	would not have
  // y’ain’t 	you are not / you have not / you did not (colloquial)
  [/^y'all$/i, 'you all'],
  // y’all’d’ve 	you all would have (colloquial/Southern American English)
  // y’all’dn't’ve 	you all would not have (colloquial/Southern American English)
  // y’all’re 	you all are (colloquial/Southern American English)
  // y’all’ren’t 	you all are not (colloquial/Southern American English)
  [/^y'at$/i, 'you at'],
  [/^y'know$/i, 'you know'],
  [/^yessir$/i, 'yes sir'],
  [/^you'd$/i, 'you would'],
  [/^you'll$/i, 'you will'],
  [/^you're$/i, 'you are'],
  [/^you've$/i, 'you have'],
];

export const normalizeContraction = (value: string): string => {
  for (const [regex, replacer] of CONTRACTIONS) {
    const normalized = value.replace(regex, replacer);
    if (normalized !== value) {
      // Eventually keep casing of first character
      return value[0] + normalized.substring(1);
    }
  }
  return value;
};
