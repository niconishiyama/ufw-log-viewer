import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Shield, Upload, Filter, Search, AlertTriangle, Clock, Globe, Network } from 'lucide-react'
import { parseUfwLogFile, formatTimestamp, getActionColor, getProtocolColor, getIpVersion } from './components/LogParser.js'
import './App.css'

function App() {
  const [logContent, setLogContent] = useState('')
  const [parsedLogs, setParsedLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [protocolFilter, setProtocolFilter] = useState('all')

  // Função para processar o conteúdo do log
  const handleLogParsing = () => {
    if (logContent.trim()) {
      const parsed = parseUfwLogFile(logContent)
      setParsedLogs(parsed)
    }
  }

  // Função para carregar arquivo de log
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogContent(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  // Filtrar logs baseado nos critérios de busca e filtros
  const filteredLogs = useMemo(() => {
    return parsedLogs.filter(log => {
      if (log.error) return false // Não mostrar logs com erro de parsing
      
      const matchesSearch = searchTerm === '' || 
        log.src_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.dst_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.hostname?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAction = actionFilter === 'all' || log.action === actionFilter.toUpperCase()
      const matchesProtocol = protocolFilter === 'all' || log.protocol === protocolFilter.toUpperCase()
      
      return matchesSearch && matchesAction && matchesProtocol
    })
  }, [parsedLogs, searchTerm, actionFilter, protocolFilter])

  // Estatísticas dos logs
  const stats = useMemo(() => {
    const total = filteredLogs.length
    const blocked = filteredLogs.filter(log => log.action === 'BLOCK').length
    const allowed = filteredLogs.filter(log => log.action === 'ALLOW').length
    const uniqueIps = new Set(filteredLogs.map(log => log.src_ip)).size
    const protocols = {}
    
    filteredLogs.forEach(log => {
      if (log.protocol) {
        protocols[log.protocol] = (protocols[log.protocol] || 0) + 1
      }
    })
    
    return { total, blocked, allowed, uniqueIps, protocols }
  }, [filteredLogs])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">UFW Log Viewer</h1>
          </div>
          <p className="text-gray-600">Visualizador de Logs do Firewall UFW - Organize e analise seus logs de forma clara e eficiente</p>
        </div>

        {/* Upload e Input de Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Carregar Logs do UFW
            </CardTitle>
            <CardDescription>
              Cole o conteúdo do seu arquivo de log do UFW ou faça upload de um arquivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".log,.txt"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button onClick={handleLogParsing} disabled={!logContent.trim()}>
                Processar Logs
              </Button>
            </div>
            <Textarea
              placeholder="Cole aqui o conteúdo do seu arquivo de log do UFW..."
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              className="min-h-32"
            />
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {parsedLogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Eventos</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bloqueados</p>
                    <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Permitidos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.allowed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">IPs Únicos</p>
                    <p className="text-2xl font-bold">{stats.uniqueIps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        {parsedLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar por IP ou Hostname</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Digite um IP ou hostname..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtrar por Ação</label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Ações</SelectItem>
                      <SelectItem value="block">BLOCK</SelectItem>
                      <SelectItem value="allow">ALLOW</SelectItem>
                      <SelectItem value="deny">DENY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtrar por Protocolo</label>
                  <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Protocolos</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="icmp">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Logs */}
        {filteredLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Logs Processados ({filteredLogs.length} eventos)</CardTitle>
              <CardDescription>
                Visualização detalhada dos eventos do firewall UFW
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>IP Origem</TableHead>
                      <TableHead>IP Destino</TableHead>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Porta Origem</TableHead>
                      <TableHead>Porta Destino</TableHead>
                      <TableHead>Interface</TableHead>
                      <TableHead>Hostname</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          <div className="space-y-1">
                            <div>{log.src_ip}</div>
                            <Badge variant="outline" className="text-xs">
                              {getIpVersion(log.src_ip)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          <div className="space-y-1">
                            <div>{log.dst_ip}</div>
                            <Badge variant="outline" className="text-xs">
                              {getIpVersion(log.dst_ip)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProtocolColor(log.protocol)}>
                            {log.protocol}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{log.src_port}</TableCell>
                        <TableCell className="font-mono">{log.dst_port}</TableCell>
                        <TableCell className="font-mono">{log.interface_in}</TableCell>
                        <TableCell className="font-mono">{log.hostname}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensagem quando não há logs */}
        {parsedLogs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum log carregado</h3>
              <p className="text-gray-600">
                Carregue um arquivo de log do UFW ou cole o conteúdo na área de texto acima para começar a análise.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App

